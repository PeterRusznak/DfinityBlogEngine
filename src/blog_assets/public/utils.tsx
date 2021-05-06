
export interface UserIdl {
    id: { toNumber(): number };
    name: string;
    description: string;
    role: [];
};


export interface EntryIdl {
    author: [UserIdl?];
    header: string;
    content: [string?];
    title: string;
    id: { toNumber(): number };
};
