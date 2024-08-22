import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';
import { Label } from './ui/label';
import { useToast } from "@/components/ui/use-toast"

const AddIdeaForm = () => {

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
    
        try {
          const response = await fetch('/api/ideas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to submit the idea.');
          } else {
            toast({
                title: "Idea Submitted",
              })
          }
    
        } catch (error: any) {
          setError(error.message);
          toast({
            title: "Error Occurred",
            description: "Please try again.",
            variant: "destructive"
          })
        } finally {
          setIsSubmitting(false);
        }
      };
    
  return (
    <form className="space-y-6">
        <div>
        <Label htmlFor="title" className="text-gray-700">
            Idea Title
        </Label>
        <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the idea title..."
            className="mt-1 block w-full"
            required
        />
        </div>

        <div>
        <Label htmlFor="description" className="text-gray-700">
            Idea Description
        </Label>
        <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea..."
            className="mt-1 block w-full"
            required
        />
        </div>

       {error && <p className="text-red-600">{error}</p>}

        <Button
        className="w-full"
        disabled={isSubmitting}
        onClick={handleSubmit}
        >
        {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin'/> : 'Submit Idea'}
        </Button>
  </form>

  )
}

const AddIdeasButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
    <Dialog open={isOpen} onOpenChange={(v) => {
        if(!v){
            setIsOpen(v)
        }
    }}>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
            <Button>Add Idea</Button>
        </DialogTrigger>

        <DialogContent>
            <AddIdeaForm/>
        </DialogContent>
    </Dialog>

  </>
  )
}


export default AddIdeasButton
