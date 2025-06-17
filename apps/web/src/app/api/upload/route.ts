import { NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // In a production app, you'd want to:
        // 1. Validate file type and size
        // 2. Process/optimize the image
        // 3. Upload to a cloud storage service (S3, Cloudinary, etc.)
        // For now, we'll just save it to the public/uploads directory

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a unique filename
        const ext = file.name.split('.').pop();
        const filename = `${randomUUID()}.${ext}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const path = join(uploadDir, filename);

        // Ensure the uploads directory exists
        const fs = await import('node:fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await writeFile(path, buffer);

        // Return the URL where the file can be accessed
        const url = `/uploads/${filename}`;
        return NextResponse.json({ url });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
