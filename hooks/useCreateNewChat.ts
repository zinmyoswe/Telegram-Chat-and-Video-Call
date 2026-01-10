import streamClient from "@/lib/stream";


export const userCreateNewChat = () => {

    const createNewChat = async ({
        members,
        createdBy,
        groupName,
    }: {
        members: string[];
        createdBy: string;
        groupName?: string;
    }) => {
        const isGroupChat = members.length > 2;

        //only check for existing chats for 1-1 conversations
        if (!isGroupChat) {
            const existingChannel = await streamClient.queryChannels( 
            {
                type: "messaging",
                members: { $eq: members },
            },
            { created_at: -1 },
            { limit: 1 }
        );

        if (existingChannel.length > 0) {
            const channel = existingChannel[0];
            const channelMembers = Object.keys(channel.state.members);

            // For 1-1 chats, ensure that the channel has exactly 2 members
            if (
                channelMembers.length === 2 &&
                members.length === 2 &&
                members.every((member) => channelMembers.includes(member))
            ) {
                console.log("Existing 1-1 chat found");
                return channel;
            }
        }
    }
    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`; //Always unique

    try{
        // Create channel with appropriate configuration for group vs 1-1 chat
        const channelData: {
            members: string[];
            created_by_id: string;
            name?: string;  
        } = {
            members,
            created_by_id: createdBy,
        };

        // For group chats, add group-specific metadata
        if (isGroupChat) {
            channelData.name = groupName || `Group Chat (${members.length} members)`;
        }

        const channel = streamClient.channel(
            isGroupChat ? "team" : "messaging",
            channelId,
            channelData
        );

        await channel.watch({
            presence: true,
        });

        return channel;
    } catch(error){
        throw error;
    }

    
};
    return createNewChat;
};
                   