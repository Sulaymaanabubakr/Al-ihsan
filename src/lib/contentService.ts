import { supabase } from './supabase';

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ContentPost {
    id: string;
    title: string;
    body: string;
    imageUrl: string;
    status: ContentStatus;
    publishedAt: string | null;
    authorId: string | null;
    createdAt: string;
}

export interface ContentInput {
    title: string;
    body?: string;
    imageUrl?: string;
    status?: ContentStatus;
}

const mapRow = (row: any): ContentPost => ({
    id: row.id,
    title: row.title,
    body: row.body ?? '',
    imageUrl: row.image_url ?? '',
    status: row.status ?? 'DRAFT',
    publishedAt: row.published_at,
    authorId: row.author_id,
    createdAt: row.created_at,
});

export const getContentPosts = async (): Promise<ContentPost[]> => {
    const { data, error } = await supabase
        .from('content_posts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
};

export const createContentPost = async (input: ContentInput): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('content_posts').insert({
        title: input.title,
        body: input.body || null,
        image_url: input.imageUrl || null,
        status: input.status || 'DRAFT',
        published_at: input.status === 'PUBLISHED' ? new Date().toISOString() : null,
        author_id: user?.id ?? null,
    });
    if (error) throw error;
};

export const updateContentPost = async (id: string, fields: Partial<ContentInput>): Promise<void> => {
    const updateData: any = { updated_at: new Date().toISOString() };
    if (fields.title !== undefined) updateData.title = fields.title;
    if (fields.body !== undefined) updateData.body = fields.body;
    if (fields.imageUrl !== undefined) updateData.image_url = fields.imageUrl;
    if (fields.status !== undefined) {
        updateData.status = fields.status;
        if (fields.status === 'PUBLISHED') updateData.published_at = new Date().toISOString();
    }
    const { error } = await supabase.from('content_posts').update(updateData).eq('id', id);
    if (error) throw error;
};

export const deleteContentPost = async (id: string): Promise<void> => {
    const { error } = await supabase.from('content_posts').delete().eq('id', id);
    if (error) throw error;
};
