// backend/services/recommend.service.js

// Categorías que ya maneja tu app (las mismas que pones en mapHFLabelToCategory)
const TOPS = ['camisa', 'sudadera', 'vestido'];
const BOTTOMS = ['pantalon', 'falda'];
const OUTER = ['chamarra'];
const SHOES = ['calzado'];

// 👉 Función auxiliar para normalizar texto
function norm(str) {
  return (str || '').toString().trim().toLowerCase();
}

// 👉 Calcula un puntaje para un outfit según clima / evento / estilo
function scoreOutfit(items, { weather, event, style }) {
  let score = 0;

  const w = norm(weather);
  const e = norm(event);
  const s = norm(style);

  const hasCategory = (cat) => items.some((i) => norm(i.category) === cat);
  const colors = items.map((i) => norm(i.color));

  // --- Clima ---
  if (w === 'frio' || w === 'cold') {
    if (hasCategory('sudadera') || hasCategory('chamarra')) score += 3;
    if (hasCategory('pantalon')) score += 1;
    if (hasCategory('falda') || hasCategory('vestido')) score -= 1;
  }

  if (w === 'calor' || w === 'calido' || w === 'hot' || w === 'warm') {
    if (hasCategory('falda') || hasCategory('vestido')) score += 2;
    if (hasCategory('camisa')) score += 1;
    if (hasCategory('sudadera') || hasCategory('chamarra')) score -= 2;
  }

  // --- Evento ---
  if (['formal', 'oficina', 'trabajo'].includes(e)) {
    if (hasCategory('camisa') && hasCategory('pantalon')) score += 3;
    if (hasCategory('vestido')) score += 2;
  }

  if (['casual', 'diario', 'escuela', 'uni'].includes(e)) {
    score += 1; // casi todo aplica
  }

  if (['fiesta', 'party', 'cita', 'date'].includes(e)) {
    if (hasCategory('vestido') || hasCategory('falda')) score += 2;
  }

  // --- Estilo (ej. grunge) ---
  if (s.includes('grunge')) {
    const darkColor = colors.some((c) =>
      ['negro', 'black', 'gris', 'gray', 'oscuro'].some((k) => c.includes(k))
    );
    if (darkColor) score += 2;
    if (hasCategory('sudadera') || hasCategory('camisa')) score += 1;
  }

  // Bonus por tener 2–3 piezas (outfit “completo”)
  if (items.length === 2 || items.length === 3) score += 1;

  return score;
}

// 👉 Genera combinaciones básicas: top+bottom (+ outer / + shoes)
function buildCombinations(clothes) {
  const tops = clothes.filter((c) => TOPS.includes(norm(c.category)));
  const bottoms = clothes.filter((c) => BOTTOMS.includes(norm(c.category)));
  const outers = clothes.filter((c) => OUTER.includes(norm(c.category)));
  const shoes = clothes.filter((c) => SHOES.includes(norm(c.category)));

  const combos = [];

  // top + bottom (+ opcionales)
  for (const top of tops) {
    for (const bottom of bottoms) {
      const base = [top, bottom];
      combos.push(base);

      for (const jacket of outers) {
        combos.push([...base, jacket]);
      }
      for (const shoe of shoes) {
        combos.push([...base, shoe]);
      }
      for (const jacket of outers) {
        for (const shoe of shoes) {
          combos.push([...base, jacket, shoe]);
        }
      }
    }
  }

  // outfits solo con vestido
  const dresses = clothes.filter((c) => norm(c.category) === 'vestido');
  for (const d of dresses) {
    combos.push([d]);
    for (const jacket of outers) {
      combos.push([d, jacket]);
    }
    for (const shoe of shoes) {
      combos.push([d, shoe]);
    }
  }

  // Si no hay combinaciones (poca ropa), devolvemos prendas sueltas
  if (combos.length === 0) {
    for (const c of clothes) {
      combos.push([c]);
    }
  }

  return combos;
}

/**
 * Genera recomendaciones de outfits para un usuario.
 * @param {Array} clothes  Lista de prendas del usuario (tal cual viene de Prisma)
 * @param {Object} filters { weather, event, style }
 * @param {number} limit   Máximo de outfits a devolver
 */
function getOutfitRecommendations(clothes, filters = {}, limit = 5) {
  if (!Array.isArray(clothes) || clothes.length === 0) {
    return [];
  }

  const combos = buildCombinations(clothes);

  // Convertimos combos en objetos con score
  const outfits = combos.map((items) => {
    // ID determinístico según IDs de prendas
    const ids = items.map((i) => i.id).sort();
    const id = ids.join('-');

    return {
      id,
      items,
      score: scoreOutfit(items, filters),
    };
  });

  // Quitamos duplicados por id
  const unique = new Map();
  for (const o of outfits) {
    const existing = unique.get(o.id);
    if (!existing || o.score > existing.score) {
      unique.set(o.id, o);
    }
  }

  // Ordenar por score DESC y limitar
  const ordered = Array.from(unique.values()).sort((a, b) => b.score - a.score);

  // Si todos tienen score 0 (sin filtros), igual devolvemos los primeros
  return ordered.slice(0, limit);
}

module.exports = {
  getOutfitRecommendations,
};
