import { IncomingMessage } from 'http';
import https from 'https';
import fs from 'fs';

/* hosts文件 */
const HOST_ASYNC_URL =
  'https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@main/hosts';

const LOCAL_HOST = '/etc/hosts';

const contentReg = /#\sasync\shost\sstart.*\s(.*\s)+.*async\shost\send/gm;

const hostContent = (host: any) => {
  let now = new Date().toLocaleString();

  return `# async host start: time - ${now}\n${host}\n# async host end\n`.trim();
};

const httpGet = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    https.get(url, (res: IncomingMessage) => {
      let data = '';
      res.on('data', chunk => (data += chunk));

      res.on('end', () => {
        resolve(data);
      });

      res.on('error', () => {
        reject(`http errro in ${url}`);
      });
    });
  });

/* 函数主入口 */
const main = async () => {
  try {
    let localHost = fs.readFileSync(LOCAL_HOST, { encoding: 'utf-8' });
    let github520HOST = await httpGet(HOST_ASYNC_URL);
    github520HOST = github520HOST.trim();
    let asyncHostContent = hostContent(github520HOST);

    if (localHost.indexOf('async host') === -1) {
      fs.appendFileSync(LOCAL_HOST, asyncHostContent);
    } else {
      let newLocalHost = localHost.replace(contentReg, asyncHostContent);
      fs.writeFileSync(LOCAL_HOST, newLocalHost);
    }
  } catch (error) {
    console.log('async-host is error: ', error);
  }
};

if (require.main === module) {
  main();
}

export default main;
