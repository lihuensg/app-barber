import { Post } from "../models/posts.js";
import { Like } from "../models/likes.js";
import { Comentario } from "../models/comentarios.js";
import { Usuario } from "../models/usuarios.js";

export const crearPost = async (req, res) => {
  try {
    const { descripcion } = req.body;
    const usuario_id = req.user.id;
    const imagen_url = req.file ? req.file.path : null;

    const nuevoPost = await Post.create({
      imagen_url,
      descripcion,
      usuario_id,
    });

    console.log('Post creado realmente:', nuevoPost?.toJSON());
    
    const postConUsuario = await Post.findByPk(nuevoPost.id, {
      include: {
        model: Usuario,
        attributes: ["id", "nombre", "email"],
      },
    });

    res.status(201).json(postConUsuario);
  } catch (error) {
    console.error("Error en crearPost:", error);
    res.status(500).json({ mensaje: "Error al crear post", error });
  }
};

export const obtenerPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: Usuario, 
          attributes: ["id", "nombre", "email", "foto_perfil"] },
        { model: Comentario,
          include : {
            model: Usuario,
            attributes: ["id", "nombre"]
          },
         },
        { model: Like, 
          include: {
            model: Usuario,
            attributes: ["id", "nombre"]
          }
        },
        
      ],
      order: [["creado_en", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener posts", error });
  }
};

export const obtenerPostPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "email"],
        },
        {
          model: Comentario,
          include: {
            model: Usuario,
            attributes: ["id", "nombre"],
          },
        },
        {
          model: Like,
          include: {
            model: Usuario,
            attributes: ["id", "nombre"],
          },
        },
      ],
    });

    if (!post) return res.status(404).json({ mensaje: "Post no encontrado" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el post", error });
  }
};

export const eliminarPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const usuario_id = req.user.id;
    const rol = req.user.rol;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ mensaje: "Post no encontrado" });

    if (post.usuario_id !== usuario_id && rol !== 'admin') {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    await post.destroy();
    res.json({ mensaje: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar post", error });
  }
};

export const eliminarComentario = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const usuario_id = req.user.id;
    const rol = req.user.rol;

    const comentario = await Comentario.findByPk(comentarioId);
    if (!comentario) return res.status(404).json({ mensaje: "Comentario no encontrado" });

    if (comentario.usuario_id !== usuario_id && rol !== 'admin') {
      return res.status(403).json({ mensaje: "No autorizado para eliminar este comentario" });
    }

    await comentario.destroy();
    res.json({ mensaje: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar comentario", error });
  }
};

export const quitarLike = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { postId } = req.params;

    const like = await Like.findOne({ where: { usuario_id, post_id: postId } });
    if (!like) {
      return res.status(404).json({ mensaje: "No diste like a este post" });
    }

    await like.destroy();
    res.json({ mensaje: "Like eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al quitar like", error });
  }
};

export const darLike = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { postId } = req.params;

    const yaExiste = await Like.findOne({
      where: { usuario_id, post_id: postId },
    });
    if (yaExiste) {
      return res.status(400).json({ mensaje: "Ya diste like a este post" });
    }

    const nuevoLike = await Like.create({ usuario_id, post_id: postId });
    res.status(201).json(nuevoLike);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al dar like", error });
  }
};

export const comentarPost = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { postId } = req.params;
    const { contenido } = req.body;

    const nuevoComentario = await Comentario.create({
      contenido,
      usuario_id,
      post_id: postId,
    });

    const comentarioConUsuario = await Comentario.findByPk(nuevoComentario.id, {
      include: {
        model: Usuario,
        attributes: ["id", "nombre"],
      },
    });
    res.status(201).json(comentarioConUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al comentar", error });
  }
};
