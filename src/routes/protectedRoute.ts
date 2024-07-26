import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import axios from 'axios';

const router = Router();

router.get('/', verifyToken, (req: Request, res: Response) => {
  res.send(`Hello, ${req.user?.email}. This is a protected route.`);
});

router.post('/api/data', verifyToken, async (req: Request, res: Response) => {
  const { tableName, data } = req.body;

  if (!tableName || !data) {
    return res.status(400).json({ error: 'Table name and data are required' });
  }

  try {
    const response = await axios.post(`https://api.appsheet.com/api/v2/apps/${process.env.APPSHEET_APP_ID}/tables/${tableName}/Action`, {
      Action: 'Add',
      Properties: {},
      Rows: [data],
    }, {
      headers: {
        'ApplicationAccessKey': process.env.APPSHEET_API_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get('/api/data', verifyToken, async (req: Request, res: Response) => {
  const { tableName } = req.query;

  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }

  try {
    const response = await axios.post(`https://api.appsheet.com/api/v2/apps/${process.env.APPSHEET_APP_ID}/tables/${tableName}/Action`, {
      Action: 'Find',
      Properties: {
        Locale: "en-US",
        Location: "47.623098, -122.330184",
        Timezone: "Pacific Standard Time",
        UserSettings: {
          "Option 1": "value1",
          "Option 2": "value2"
        }
      },
      Rows: []
    }, {
      headers: {
        'ApplicationAccessKey': process.env.APPSHEET_API_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
