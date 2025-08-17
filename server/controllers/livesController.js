import Live from '../Models/Live.js';
import { parseYoutubeUrl } from '../utils/parseYoutubeUrl.js';

export const addLive = async (req, res) => {
  try {
    const { title, description, url, isLive, tags } = req.body;

    // Convert YouTube watch links -> embed links
    const embedUrl = parseYoutubeUrl(url);

    const live = await Live.create({
      title,
      url: embedUrl, // store embed url
      isLive,
    });

    res.status(201).json(live);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add live" });
  }
};

export const deleteLive = async (req, res) => {
  const { id } = req.params;
  await Live.findByIdAndDelete(id);
  res.json({ message: 'Live deleted' });
};

export const getLives = async (req, res) => {
  const { isLive } = req.query;
  const filter = isLive ? { isLive: isLive === 'true' } : {};
  const lives = await Live.find(filter).sort({ createdAt: -1 });
  res.json(lives);
};

