import { db } from "@/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const idea = await db.idea.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        votes: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!idea) {
      return new Response("Idea not found", { status: 404 });
    }

    const upVotes = idea.votes.filter((vote: { value: any; }) => vote.value).length;
    const downVotes = idea.votes.filter((vote: { value: any; }) => !vote.value).length;

    const detailedIdea = {
      ...idea,
      upVotes,
      downVotes,
    };

    return new Response(JSON.stringify(detailedIdea), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error Occurred", error }), { status: 500 });
  }
}
