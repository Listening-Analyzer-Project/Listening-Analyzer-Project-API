-- Ambiances / tags
INSERT INTO tag (name, color_index) VALUES 
-- Index 1: Rating
('★★★★★', 1), ('★★★★☆', 1), ('★★★☆☆', 1), ('★★☆☆☆', 1), ('★☆☆☆☆', 1), ('☆☆☆☆☆', 1), 
('Banger', 1), ('Guilty Pleasure', 1),

-- Index 2: Context
('After', 2), ('Before', 2), ('Chill', 2), ('Cleaning', 2), ('Cocktail', 2), 
('Dancefloor', 2), ('Focus', 2), ('Karaoke', 2), ('Party', 2), ('Road Trip', 2), 
('Sex', 2), ('Sleep', 2), ('Workout', 2),

-- Index 3: Vocals (Ce qu'on entend comme voix)
('Full Singing', 3),
('Instrumental', 3),    -- 0 voix
('Vocals', 3),   -- Juste quelques mots ou des voix de fond

-- Index 4: Mood
('Angry', 4), ('Dark', 4), ('Dreamy', 4), ('Epic', 4), ('Euphoric', 4), 
('Happy', 4), ('Melancholic', 4), ('Romantic', 4), ('Sad', 4),

-- Index 5: Energy (Le "volume" d'énergie ressenti)
('Calm', 5),          -- Tranquille
('Energetic', 5),     -- Qui donne la pêche
('Intense', 5),       -- Très fort / Puissant
('Quiet', 5),         -- Très discret / Doux
('Steady', 5),        -- Un rythme régulier, qui avance bien

-- Index 6: Style (Le "look" du son)
('Acoustic', 6),      -- Vrais instruments (guitare, piano...)
('Clean', 6),         -- Son moderne et propre
('Electronic', 6),    -- Sons de machines / synthés
('Cinematic', 6),   -- Musique qui fait penser à un film
('Lo-fi', 6),    -- Qui sonne vieux ou vintage (le fameux Lo-fi)
('Rough', 6);         -- Son brut, un peu garage ou "sale"