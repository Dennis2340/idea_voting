"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, MessageSquare, Trash, Ghost } from 'lucide-react';
import AddIdeasButton from './AddIdeasButton';
import { MyLoader } from './MyLoader';

export interface Idea {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    upVotes: number;
    downVotes: number;
}

const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'Solar-Powered Car',
    description: 'A car that runs entirely on solar energy.',
    createdAt: '2024-01-15T12:34:56Z',
    upVotes: 50,
    downVotes: 5
  },
  {
    id: '2',
    title: 'Vertical Farming',
    description: 'Grow food in vertically stacked layers to save space.',
    createdAt: '2024-02-20T09:24:11Z',
    upVotes: 40,
    downVotes: 3
  },
  {
    id: '3',
    title: 'Smart Traffic Lights',
    description: 'Traffic lights that adapt in real-time to traffic conditions.',
    createdAt: '2024-03-03T08:14:22Z',
    upVotes: 35,
    downVotes: 2
  },
];

const IdeaBrowsingDashboard = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch('/api/ideas');
                if (!response.ok) {
                    throw new Error('Failed to fetch ideas');
                }
                const data = await response.json();
                setIdeas(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching ideas:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIdeas();
    }, []);
  
    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
                <h1 className='mt-3 font-bold text-5xl text-gray-900'>
                    Ideas
                </h1>
                
                <div>
                    <AddIdeasButton />
                </div>
            </div>

            {isLoading ? (
                <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className='col-span-1'>
                            <MyLoader />
                        </div>
                    ))}
                </div>
            ) : ideas && ideas.length !== 0 ? (
                <ul className='mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3'>
                    {ideas
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((idea) => (
                            <li key={idea.id} className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
                                <Link href={`/dashboard/${idea.id}`} className='flex flex-col gap-2 '>
                                    <div className="pt-6 flex w-full items-center justify-between space-x-6">
                                        <div className='h-10 w-10 ml-2 flex-shrink-0 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-600' />
                                        <div className="flex-1 truncate">
                                            <div className="flex items-center space-x-3">
                                                <h3 className='truncate text-lg font-medium text-zinc-900'>{idea.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
                                    <div className="flex items-center gap-2 ">
                                        <Plus className='h-4 w-4' />
                                        {new Date(idea.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 ">
                                        {idea.upVotes + idea.downVotes} {idea.upVotes + idea.downVotes > 1 ? "Votes" : "Vote"}
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    <Ghost className='h-8 w-8 text-zinc-800' />
                    <h3 className='font-semibold text-xl'>No ideas yet</h3>
                    <p>Let&apos;s add your first idea.</p>
                </div>
            )}
        </main>
    );
}

export default IdeaBrowsingDashboard;
