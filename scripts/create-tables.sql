-- Crear tabla de canchas
CREATE TABLE IF NOT EXISTS canchas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('F5', 'F10', 'MIXTA')),
  precio INTEGER NOT NULL,
  precio_f5 INTEGER,
  precio_f10 INTEGER,
  descripcion TEXT,
  descripcion_f5 TEXT,
  descripcion_f10 TEXT,
  capacidad VARCHAR(50),
  capacidad_f5 VARCHAR(50),
  capacidad_f10 VARCHAR(50),
  caracteristicas TEXT[],
  caracteristicas_f5 TEXT[],
  caracteristicas_f10 TEXT[],
  horarios TEXT[],
  imagen_url TEXT,
  imagen_f5_url TEXT,
  imagen_f10_url TEXT,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cancha_id INTEGER REFERENCES canchas(id),
  tipo_seleccionado VARCHAR(10) CHECK (tipo_seleccionado IN ('F5', 'F10')),
  fecha DATE NOT NULL,
  horario TIME NOT NULL,
  jugador_nombre VARCHAR(255) NOT NULL,
  jugador_telefono VARCHAR(50) NOT NULL,
  jugador_email VARCHAR(255) NOT NULL,
  precio INTEGER NOT NULL,
  sena INTEGER NOT NULL,
  sena_pagada BOOLEAN DEFAULT false,
  comentarios TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  mercadopago_id VARCHAR(255),
  mercadopago_status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cancha_id, tipo_seleccionado, fecha, horario)
);

-- Insertar datos de ejemplo de canchas
INSERT INTO canchas (
  nombre, tipo, precio, precio_f5, precio_f10, 
  descripcion, descripcion_f5, descripcion_f10,
  capacidad, capacidad_f5, capacidad_f10,
  caracteristicas, caracteristicas_f5, caracteristicas_f10,
  horarios, imagen_url, imagen_f5_url, imagen_f10_url
) VALUES
('Boulevard', 'MIXTA', 15000, 8000, 15000,
 'Cancha versátil que se adapta a F5 y F10', 
 'Perfecta para partidos íntimos de fútbol 5',
 'Cancha amplia ideal para partidos de fútbol 10',
 '10-20 jugadores', '10 jugadores', '20 jugadores',
 ARRAY['Césped sintético', 'Iluminación LED', 'Vestuarios', 'Estacionamiento'],
 ARRAY['Césped sintético', 'Iluminación LED', 'Vestuarios'],
 ARRAY['Césped sintético', 'Iluminación LED', 'Vestuarios', 'Estacionamiento', 'Tribuna'],
 ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
 '/placeholder.svg?height=400&width=600&text=Boulevard',
 '/placeholder.svg?height=400&width=600&text=Boulevard+F5',
 '/placeholder.svg?height=400&width=600&text=Boulevard+F10'),

('La Calle F5', 'F5', 8000, NULL, NULL,
 'Perfecta para partidos íntimos con amigos', NULL, NULL,
 '10 jugadores', NULL, NULL,
 ARRAY['Césped sintético', 'Iluminación', 'Vestuarios'], NULL, NULL,
 ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
 '/placeholder.svg?height=400&width=600&text=La+Calle+F5', NULL, NULL),

('La Calle Techada F5', 'F5', 8000, NULL, NULL,
 'Cancha techada para jugar en cualquier clima', NULL, NULL,
 '10 jugadores', NULL, NULL,
 ARRAY['Techada', 'Césped sintético', 'Climatizada', 'Vestuarios'], NULL, NULL,
 ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
 '/placeholder.svg?height=400&width=600&text=La+Calle+Techada+F5', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_reservas_cancha_fecha ON reservas(cancha_id, fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_cancha_tipo_fecha ON reservas(cancha_id, tipo_seleccionado, fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
