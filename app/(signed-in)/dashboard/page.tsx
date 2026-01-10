import { useSidebar } from '@/components/ui/sidebar';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import React from 'react'
import { useChatContext } from 'stream-chat-react';

function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { channel, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();

  return <div>Dashboard</div>
}

export default Dashboard