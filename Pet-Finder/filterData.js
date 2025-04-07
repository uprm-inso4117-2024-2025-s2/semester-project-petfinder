function filterData(pets, searchQuery, selectedFilter) {
  return pets.filter(pet =>
    (selectedFilter === "" || pet.type.includes(selectedFilter)) &&
    (searchQuery === "" || pet.name.includes(searchQuery))
  );
}
module.exports = { filterData };