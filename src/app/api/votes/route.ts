import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ideaId, value } = body; 

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const userId = user?.id;

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const dbUser = await db.user.findFirst({
      where: { id: userId },
    });
    if (!dbUser) return new Response("Unauthorized", { status: 401 });

    const existingVote = await db.vote.findFirst({
      where: {
        ideaId,
        userId: dbUser.id,
      },
    });

    let voteResponse;
    if (existingVote) {
      
      voteResponse = await db.vote.update({
        where: { id: existingVote.id },
        data: { value },
      });
    } else {
      // If no vote exists, create a new one
      voteResponse = await db.vote.create({
        data: {
          value,
          user: { connect: { id: userId } },
          idea: { connect: { id: ideaId } },
        },
      });
    }

    const updatedVotes = await db.vote.findMany({
      where: { ideaId },
    });

    const upvotes = updatedVotes.filter((vote: { value: boolean; }) => vote.value === true).length;

    return new Response(
      JSON.stringify({ upvotes }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error Occurred", error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function GET(req: Request) {
  try {
    const { ideaId } = await req.json(); // Changed from `factId` to `ideaId`

    const votes = await db.vote.findMany({
      where: { ideaId },
      include: {
        user: true,
      },
    });

    const summarizedVotes = votes.map((vote:any) => {
      const upVotes = vote.votes.filter((vote: { value: any; }) => vote.value).length;
      const downVotes = vote.votes.filter((vote: { value: any; })  => !vote.value).length;
      return {
        ...vote,
        upVotes,
        downVotes,
      };
    });

    return new Response(JSON.stringify(summarizedVotes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error Occurred", error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
