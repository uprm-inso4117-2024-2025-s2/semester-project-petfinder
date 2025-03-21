import { supabase } from '../supabaseClient.js';

export const createSighting = async (req, res) => {
  const { report_id, user_id, description, photo, location, timestamp, verified } = req.body;
  const { data, error } = await supabase.from('Sightings').insert([{ report_id, user_id, description, photo, location, timestamp, verified }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const getAllSightings = async (req, res) => {
  const { data, error } = await supabase.from('Sightings').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const getSightingById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Sightings').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Sighting not found' });
  res.status(200).json(data);
};

export const updateSighting = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('Sightings').update(updates).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteSighting = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Sightings').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};