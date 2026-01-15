import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatPanel } from './chat-panel';
import { LogoIcon } from '@/components/icons';

export function Chat() {
  return (
    <Card className="w-full h-[60vh] max-h-[600px] flex flex-col shadow-2xl rounded-xl border-border">
      <CardHeader className="flex flex-row items-center gap-4">
        <LogoIcon className="h-10 w-10 text-primary" />
        <div>
          <CardTitle className="text-xl font-bold font-headline">WebAssist</CardTitle>
          <CardDescription>Your AI-powered support assistant</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ChatPanel />
      </CardContent>
    </Card>
  );
}
