import { db } from "@/db";

export async function GET(req: Request, { params }: { params: { ideaId: string } }) {
  try {
    const votes = await db.vote.findMany({
      where: { ideaId: params.ideaId },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return new Response(JSON.stringify(votes), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error Occurred", error }), { status: 500 });
  }
}
