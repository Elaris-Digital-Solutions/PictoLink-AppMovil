export interface Contact {
    id: string;
    user_id: string;
    contact_id: string;
    created_at: string;
}

export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    read: boolean;
}

export interface ContactWithUser {
    id: string;
    contact_id: string;
    name: string;
    email: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unread: number;
}

export interface AddContactResponse {
    status: 'ok' | 'error';
    message?: string;
    contact_id?: string;
}
