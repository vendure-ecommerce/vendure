import express from 'express';
import fs from 'fs-extra';
import http from 'http';
import path from 'path';

/**
 * An email inbox application that serves the contents of the dev mode `outputPath` directory.
 */
export class DevMailbox {
    server: http.Server;

    serve(port: number, outputPath: string) {
        const server = express();
        server.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../dev-mailbox.html'));
        });
        server.get('/list', async (req, res) => {
            const list = await fs.readdir(outputPath);
            const contents = await this.getEmailList(outputPath);
            res.send(contents);
        });
        server.get('/item/:id', async (req, res) => {
            const fileName = req.params.id;
            const content = await this.getEmail(outputPath, fileName);
            res.send(content);
        });
        this.server = server.listen(port);
    }

    destroy() {
        this.server.close();
    }

    private async getEmailList(outputPath: string) {
        const list = await fs.readdir(outputPath);
        const contents: any[] = [];
        for (const fileName of list) {
            const json = await fs.readFile(path.join(outputPath, fileName), 'utf-8');
            const content = JSON.parse(json);
            contents.push({
                fileName,
                date: content.date,
                subject: content.subject,
                recipient: content.recipient,
            });
        }
        contents.sort((a, b) => {
            return a.date > b.date ? -1 : 1;
        });
        return contents;
    }

    private async getEmail(outputPath: string, fileName: string) {
        const safeSuffix = path.normalize(fileName).replace(/^(\.\.(\/|\\|$))+/, '');
        const safeFilePath = path.join(outputPath, safeSuffix);
        const json = await fs.readFile(safeFilePath, 'utf-8');
        const content = JSON.parse(json);
        return content;
    }
}
