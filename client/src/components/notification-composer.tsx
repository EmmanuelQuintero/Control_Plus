import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";

interface NotificationComposerProps {
  onSend?: (data: any) => void;
}

export function NotificationComposer({ onSend }: NotificationComposerProps) {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [priority, setPriority] = useState("normal");

  const handleSend = () => {
    console.log("Sending notification:", { message, recipient, priority });
    onSend?.({ message, recipient, priority });
    setMessage("");
  };

  return (
    <Card data-testid="card-notification-composer">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Send Notification</CardTitle>
            <CardDescription>Send motivational messages to users</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient</Label>
          <Select value={recipient} onValueChange={setRecipient}>
            <SelectTrigger id="recipient" data-testid="select-recipient">
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority" data-testid="select-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            data-testid="textarea-message"
          />
        </div>
        <Button
          onClick={handleSend}
          className="w-full"
          disabled={!message || !recipient}
          data-testid="button-send-notification"
        >
          Send Notification
        </Button>
      </CardContent>
    </Card>
  );
}
