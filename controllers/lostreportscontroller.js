import { supabase } from '../supabaseClient.js';

export const createLostReport = async (req, res) => {
  const { pet_id, owner_id, description, photo, lost_at, location, status } = req.body;
  const { data, error } = await supabase.from('LostReports').insert([{ pet_id, owner_id, description, photo, lost_at, location, status }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const getAllLostReports = async (req, res) => {
  const { data, error } = await supabase.from('LostReports').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const getLostReportById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('LostReports').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Lost report not found' });
  res.status(200).json(data);
};

export const updateLostReport = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('LostReports').update(updates).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteLostReport = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('LostReports').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};
