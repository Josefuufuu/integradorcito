import React, { useState } from 'react';
import RatingAndComment from '../components/ui/RatingAndComment';
import CommentList from '../components/ui/CommentList';

export default function TestRatingPage() {
  const [comments, setComments] = useState([]);

  // Función para PUBLICAR un nuevo comentario
  const handlePublishReview = (newRating, newComment) => {
    const newReview = { 
      id: Date.now(),
      author: 'Tú (Estudiante)', 
      date: 'Ahora', 
      rating: newRating, 
      text: newComment,
      isCurrentUser: true,
    };
    setComments(prevComments => [newReview, ...prevComments]);
  };

  // Función para GUARDAR la edición de un comentario
  const handleEditSave = (commentId, newRating, newComment) => {
    setComments(prevComments =>
      prevComments.map(c =>
        c.id === commentId
          ? { ...c, rating: newRating, text: newComment, date: 'Editado ahora' }
          : c
      )
    );
  };

  // Función para ELIMINAR un comentario de la lista
  const handleDeleteComment = (commentId) => {
    setComments(prevComments =>
      // Filtramos la lista, quedándonos solo con los comentarios que NO tengan el ID a eliminar
      prevComments.filter(comment => comment.id !== commentId)
    );
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Actividad: Taller de Fotografía (Finalizada)</h1>
        <p>Has asistido a esta actividad. ¡Por favor, déjanos tu opinión!</p>
      </header>
      <div className="form-card">
        <RatingAndComment
          onSubmit={handlePublishReview}
          buttonText="Publicar Comentario"
        />
        {/* Pasamos la nueva función de eliminar al componente de la lista */}
        <CommentList 
          comments={comments} 
          onEditSave={handleEditSave} 
          onDelete={handleDeleteComment} 
        />
      </div>
    </div>
  );
}