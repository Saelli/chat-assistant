'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactHumanSupport } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useState } from 'react';
import { Loader2, ChevronLeft } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

interface HumanFormProps {
  onBack: () => void;
}

export function HumanForm({ onBack }: HumanFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await contactHumanSupport(values);
      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: result.message,
        });
        setSubmitted(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: result.message,
        });
      }
    });
  }
  
  if (submitted) {
    return (
      <div className="p-6 text-center flex flex-col items-center gap-4 flex-1 justify-center">
        <h3 className="text-lg font-semibold">Thank you!</h3>
        <p className="text-muted-foreground">A support agent will be in touch with you via email shortly.</p>
        <Button onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 border-t flex-1 overflow-y-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h3 className="text-lg font-medium">Contact Support</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us how we can help"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
