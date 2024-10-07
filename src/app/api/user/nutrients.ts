// pages/api/nutrients.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getValidAccessToken } from '@/lib/utils/auth-utils';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let accessToken = await getValidAccessToken();
   
  try {
    if (req.method === 'GET') {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_ZIMASA_MEAL_GOAL}`;
    
          const response = await axios.get(apiUrl, {
            headers: {
                
              Authorization: "Bearer " + accessToken,
            },
          });
          console.log("RESPONSE : ", res);
          return res.status(200).json(response.data);
        
        } catch (error: any) {
          return res.status(error.response?.status || 500).json({ message: error.message });
        }
      };
  } catch (error) {
    // Handle errors
    console.error('Error fetching nutrients:', error);
    res.status(500).json({ error: 'Failed to fetch nutrients' });
  }
}
