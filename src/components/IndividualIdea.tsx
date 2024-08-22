"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Idea {
    id: string;
    title: string;
    description: string;
    sourceLink: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    upVotes: number;
    downVotes: number;
    user: {
      id: string;
      name: string;
      email: string;
    };
}

const mockIdea: Idea = {
    id: "1",
    title: "Solar-Powered Water Purifier",
    description: "A device that uses solar energy to purify water, making it drinkable.",
    sourceLink: "https://example.com/solar-purifier",
    userId: "user123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upVotes: 100,
    downVotes: 5,
    user: {id: "", name: "", email: ""}
};

const IndividualIdea = ({ideaId}: {ideaId:string}) => {
  const [idea, setIdea] = useState<Idea | null>(mockIdea);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVotingUp, setIsVotingUp] = useState<boolean>(false);
  const [isVotingDown, setIsVotingDown] = useState<boolean>(false);

  useEffect(() => {
    const fetchIdeaDetails = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/ideas/${ideaId}`);
          const data = await response.json();
          setIdea(data);
        } catch (error) {
          console.error('Error fetching idea details:', error);
        } finally {
          setIsLoading(false);
        }
      };
    if (ideaId) {
      fetchIdeaDetails();
    }
  }, [ideaId]);

  const handleVote = async (voteValue: boolean) => {
    try {
        if(voteValue){
            setIsVotingUp(true);
        }else {
            setIsVotingDown(true);
        }
      const response = await fetch(`/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideaId, value: voteValue }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setIdea((prevIdea) => prevIdea && {
          ...prevIdea,
          upVotes: data.upVotes,
          downVotes: data.downVotes,
        });
      } else {
        console.error('Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVotingUp(false);
      setIsVotingDown(false);
    }
  };
  
  if (isLoading) {
    return <Loader2 className="animate-spin h-10 w-10 text-gray-800 mx-auto mt-20" />;
  }

  if (!idea) {
    return <div className="text-center text-gray-700 mt-20">Idea not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <Avatar>
          <AvatarImage src={`https://api.adorable.io/avatars/40/${idea.user.email}.png`} alt={idea.user.name} />
          <AvatarFallback>{idea.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{idea.user.name}</h2>
          <p className="text-sm text-gray-500">Posted on: {new Date(idea.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{idea.title}</h1>
      <p className="text-lg text-gray-800 mb-4">{idea.description}</p>
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => handleVote(true)} disabled={isVotingUp}>
          {isVotingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upvote'}
        </Button>
        <Button onClick={() => handleVote(false)} disabled={isVotingDown}>
          {isVotingDown ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Downvote'}
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-green-600">{idea.upVotes} Upvotes</span>
          <span className="text-red-600">{idea.downVotes} Downvotes</span>
        </div>
      </div>
    </main>
  );
};

export default IndividualIdea;
