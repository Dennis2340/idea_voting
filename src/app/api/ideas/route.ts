import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const userId = user?.id;
    const email = user?.email;

    if (!user || !userId || !email) return new Response("Unauthorized", { status: 401 });

    let dbUser = await db.user.findFirst({
      where: { id: userId }
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          name: `${user?.given_name} ${user?.family_name}`,
          id: user?.id!,
          email: user?.email!,
        },
      });
    }

    const newIdea = await db.idea.create({
      data: {
        title,
        description,
        user: { connect: { id: dbUser.id } },
      },
    });

    return new Response(JSON.stringify(newIdea), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error Occurred", error }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const ideas = await db.idea.findMany({
      include: {
        user: true,
        votes: true,
      },
    });

    const summarizedIdeas = ideas.map((idea:any) => {
      const upVotes = idea.votes.filter((vote: { value: any; }) => vote.value).length;
      const downVotes = idea.votes.filter((vote: { value: any; })  => !vote.value).length;
      return {
        ...idea,
        upVotes,
        downVotes,
      };
    });

    return new Response(JSON.stringify(summarizedIdeas), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error Occurred", error }), { status: 500 });
  }
}
