"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import{ Call, CallingState ,StreamCall, StreamVideo, StreamTheme, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { createToken } from '@/actions/createToken';

if(!process.env.NEXT_PUBLIC_STREAM_API_KEY){
    throw new Error('NEXT_PUBLIC_STREAM_API_KEY is not defined');
}

function layout ({ children } : {children: React.ReactNode}) {
    const { user } = useUser();
    const {id} = useParams();
    const [ call, setCall ] = useState<Call>();
    const [error, setError] = useState<string>();
    const [client, setClient] = useState<StreamVideoClient | null>(null);

    const streamUser = useMemo(() => {
        if(!user){
            return null;
        }

        return {
            id: user.id,
            name: user.fullName || user.emailAddresses[0].emailAddress || "Unknown User",
            image: user.imageUrl || "",
            type: "authenticated" as const,
        }

    }, [user])

    //Create token provider function outside of useMemo to avoid calling during render
    const tokenProvdier = useCallback(async () => {
        if(!user?.id){
            throw new Error("User not authenticated");
        }
        return await createToken(user.id);
    }, [user?.id]);

    // Initialize client in useEffect to avoid side effects during render
    useEffect(() => {
        if(!streamUser){
            setClient(null);
            return;
        }
        const newClient = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
            user: streamUser,
            tokenProvdier,
    });

    setClient(newClient);

    return () => {
        newClient.disconnectUser().catch(console.error);
    };
    }, [ streamUser, tokenProvdier]);

    
    useEffect(() => {
        if(!client || !id) return;
        
        setError(null);
        const StreamCall = client.call("default", id as string);

        const joinCall = async () => {
            try {
                await StreamCall.join({ create: true });
                setCall(StreamCall);
            } catch (error) {
                console.error("Failed to join call", error);
                setError(
                    error instanceof Error ? error.message :"Failed to join call"
                );
            }
        };
        joinCall();

        // cleanup function
        return () => {
            if(streamCall && StreamCall.state.callingState === CallingState.JOINED){
                StreamCall.leave().catch(console.error);
            }
            
        };
    }, [id, client]);
         
  if(!client){
    return <div>Loading...client</div>;
  }

  if(!call){
    return <div>Loading...call</div>;
  }

  return (
    <StreamVideo client={client}>
        <StreamTheme className="text-white">
            <StreamCall call={call}>{children}</StreamCall>
           
        </StreamTheme>
    </StreamVideo>
    
  )
}

export default layout