import React from 'react';

// Karakter detaylarini getiren fonksiyonel bilesen
//paramatresi characther prop udur
const CharacterDetails = ({ character }) => {
  if (!character) //prop null veya undefined ise kullanıcı uyarıldı
    return <div className="alert alert-info">Select a character to see details</div>;
// aksi halde karakter detayları kullanıcıya bootstrap kartı kullanarak gösterildi
  return (
    <div className="card my-4 charcard">
      <div className="card-body d-flex align-items-center">
        <img src={character.image} alt={character.name} className="img-fluid me-4 rounded"/>
        <div>
          <h2>{character.name}</h2>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Gender: {character.gender}</p>
          <p>Origin: {character.origin.name}</p>
          <p>Location: {character.location.name}</p>
        </div>
      </div>
    </div>
  );  
};

export default CharacterDetails;
