import * as cheerio from 'cheerio'
import axios from 'axios';

export default async function getEmbedController(req,res){
  const url = req.body?.url;
  let axios_instance = axios.create({timeout: 9999})
  const response = await axios_instance.get(url);
  const $ = cheerio.load(response.data);
  const metaTags = [];

  $('meta').each((i, element) => {
      const property = $(element).attr('property');
      const content = $(element).attr('content');
      if (property && content) {
          metaTags.push({
              property: property,
              content: content
          });
      }
  });
  return res.status(200).json({metaTags:metaTags})
}
