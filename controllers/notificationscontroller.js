import { supabase } from '../supabaseClient.js';

export const createNotification = async (req, res) => {
  const { user_id, message, read_status } = req.body;
  const { data, error } = await supabase.from('Notifications').insert([{ user_id, message, read_status }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const getAllNotifications = async (req, res) => {
  const { data, error } = await supabase.from('Notifications').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const getNotificationById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Notifications').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Notification not found' });
  res.status(200).json(data);
};

export const updateNotification = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('Notifications').update(updates).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Notifications').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};