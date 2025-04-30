import { supabase } from '../supabaseClient.js';

export const createFoundReport = async (req, res) => {
  const { lost_report_id, owner_id, evidence } = req.body;
  const { data, error } = await supabase.from('FoundReports').insert([{ lost_report_id, owner_id, evidence }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const getAllFoundReports = async (req, res) => {
  const { data, error } = await supabase.from('FoundReports').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const getFoundReportById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('FoundReports').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Found report not found' });
  res.status(200).json(data);
};

export const updateFoundReport = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('FoundReports').update(updates).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteFoundReport = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('FoundReports').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};