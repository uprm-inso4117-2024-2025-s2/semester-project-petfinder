import { supabase } from '../supabaseClient.js';

// Create a new pet
export const createPet = async (req, res) => {
  const { owner_id, name, species, breed, color, size, profile_photo, status } = req.body;

  const { data, error } = await supabase
    .from('Pets')
    .insert([{ owner_id, name, species, breed, color, size, profile_photo, status }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// Get all pets
export const getAllPets = async (req, res) => {
  const { data, error } = await supabase.from('Pets').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

// Get one pet by ID
export const getPetById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Pets').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Pet not found' });
  res.status(200).json(data);
};

// Update a pet
export const updatePet = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('Pets')
    .update(updates)
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

// Delete a pet
export const deletePet = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Pets').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};
