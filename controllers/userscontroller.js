import { supabase } from '../supabaseClient.js';

export const createUser = async (req, res) => {
  const { email, password_hash, full_name, phone, location } = req.body;
  const { data, error } = await supabase
    .from('Users')
    .insert([{ email, password_hash, full_name, phone, location }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const getAllUsers = async (req, res) => {
  const { data, error } = await supabase.from('Users').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Users').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(data);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('Users').update(updates).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Users').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};