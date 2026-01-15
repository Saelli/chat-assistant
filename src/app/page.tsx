import { ChatWidget } from '@/components/chat/chat-widget';
import { LogoIcon } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 px-6">
        <div className="container mx-auto flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">WebAssist</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Build a Better Web, Faster
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            Welcome to the demonstration page for WebAssist. Explore how our AI-powered assistant, website creation tools, and API services can revolutionize your development workflow. 
            Click the chat icon to get started.
          </p>
        </div>
        
        <div className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-bold mb-2 font-headline">Website Creation</h3>
              <p className="text-muted-foreground">Instantly generate stunning, responsive websites with our intuitive tools. No coding required, but powerful enough for developers.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-bold mb-2 font-headline">API Services</h3>
              <p className="text-muted-foreground">Integrate powerful backend services with our easy-to-use APIs. From authentication to data storage, we've got you covered.</p>
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
