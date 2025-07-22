import { Post } from "../models/posts.js";
import { Like } from "../models/likes.js";
import { Comentario } from "../models/comentarios.js";

// 📸 Crear post
export const crearPost = async (req, res) => {
  try {
    const { imagen_url, descripcion } = req.body;
    const usuario_id = req.user.id;

    const nuevoPost = await Post.create({
      imagen_url,
      descripcion,
      usuario_id,
    });
    res.status(201).json(nuevoPost);
  } catch (error) {
    console.error("Error en crearPost:", error);
    res.status(500).json({ mensaje: "Error al crear post", error });
  }
};

// 🧾 Obtener todos los posts (con comentarios y likes)
export const obtenerPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: Comentario }, { model: Like }],
      order: [["creado_en", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener posts", error });
  }
};

// 👍 Dar like
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

// 💬 Comentar post
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
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al comentar", error });
  }
};
