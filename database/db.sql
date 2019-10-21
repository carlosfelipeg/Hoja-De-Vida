
CREATE DATABASE hojadevida1;

use hojadevida;
CREATE TABLE `educacion_superior` (
  `num_tarjetaProfesional` int(25) NOT NULL,
  `nombre_estudio` varchar(50) NOT NULL,
  `año_finalizacion` int(11) NOT NULL,
  `modalidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experiencia_laboral`
--

CREATE TABLE `experiencia_laboral` (
  `nombre_empresa` varchar(30) NOT NULL,
  `cargo_ocupado` varchar(30) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `pais` varchar(30) NOT NULL,
  `ciudad` varchar(30) NOT NULL,
  `id_experiencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formacion_academica`
--

CREATE TABLE `formacion_academica` (
  `nivel_alcanzado` varchar(50) NOT NULL,
  `nombre_institucion` varchar(50) NOT NULL,
  `año_grado` year(4) NOT NULL,
  `pais_origen` varchar(50) NOT NULL,
  `id_formacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formacion_persona`
--

CREATE TABLE `formacion_persona` (
  `documento_persona` int(11) NOT NULL,
  `id_formacion` int(11) NOT NULL,
  `id_formacion_persona` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `documento` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `direccion` varchar(30) NOT NULL,
  `telefono` int(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `Estado civil` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `postgrado_persona`
--

CREATE TABLE `postgrado_persona` (
  `documento_persona` int(11) NOT NULL,
  `id_postgrado` int(11) NOT NULL,
  `num_tarjeta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `referencia`
--

CREATE TABLE `referencia` (
  `documento` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `referencia_persona`
--

CREATE TABLE `referencia_persona` (
  `documento_referido` int(11) NOT NULL,
  `documento_referente` int(11) NOT NULL,
  `id_referencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajos`
--

CREATE TABLE `trabajos` (
  `id_trabajo` int(11) NOT NULL,
  `documento_persona` int(11) NOT NULL,
  `id_experiencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `educacion_superior`
--
ALTER TABLE `educacion_superior`
  ADD PRIMARY KEY (`num_tarjetaProfesional`);

--
-- Indices de la tabla `experiencia_laboral`
--
ALTER TABLE `experiencia_laboral`
  ADD PRIMARY KEY (`id_experiencia`);

--
-- Indices de la tabla `formacion_academica`
--
ALTER TABLE `formacion_academica`
  ADD PRIMARY KEY (`id_formacion`);

--
-- Indices de la tabla `formacion_persona`
--
ALTER TABLE `formacion_persona`
  ADD PRIMARY KEY (`id_formacion_persona`),
  ADD KEY `id_formacion` (`id_formacion`),
  ADD KEY `documento_persona` (`documento_persona`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`documento`);

--
-- Indices de la tabla `postgrado_persona`
--
ALTER TABLE `postgrado_persona`
  ADD PRIMARY KEY (`id_postgrado`),
  ADD KEY `num_tarjeta` (`num_tarjeta`),
  ADD KEY `postgrado_persona` (`documento_persona`);

--
-- Indices de la tabla `referencia`
--
ALTER TABLE `referencia`
  ADD PRIMARY KEY (`documento`);

--
-- Indices de la tabla `referencia_persona`
--
ALTER TABLE `referencia_persona`
  ADD PRIMARY KEY (`id_referencia`),
  ADD KEY `documento_referido` (`documento_referido`),
  ADD KEY `documento_referente` (`documento_referente`);

--
-- Indices de la tabla `trabajos`
--
ALTER TABLE `trabajos`
  ADD PRIMARY KEY (`id_trabajo`),
  ADD KEY `documento_persona` (`documento_persona`),
  ADD KEY `id_experiencia` (`id_experiencia`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `formacion_persona`
--
ALTER TABLE `formacion_persona`
  ADD CONSTRAINT `formacion_persona_ibfk_1` FOREIGN KEY (`id_formacion`) REFERENCES `formacion_academica` (`id_formacion`),
  ADD CONSTRAINT `formacion_persona_ibfk_2` FOREIGN KEY (`documento_persona`) REFERENCES `persona` (`documento`);

--
-- Filtros para la tabla `postgrado_persona`
--
ALTER TABLE `postgrado_persona`
  ADD CONSTRAINT `postgrado_persona` FOREIGN KEY (`documento_persona`) REFERENCES `persona` (`documento`),
  ADD CONSTRAINT `postgrado_persona_ibfk_1` FOREIGN KEY (`num_tarjeta`) REFERENCES `educacion_superior` (`num_tarjetaProfesional`);

--
-- Filtros para la tabla `referencia_persona`
--
ALTER TABLE `referencia_persona`
  ADD CONSTRAINT `referencia_persona_ibfk_1` FOREIGN KEY (`documento_referido`) REFERENCES `persona` (`documento`),
  ADD CONSTRAINT `referencia_persona_ibfk_2` FOREIGN KEY (`documento_referente`) REFERENCES `referencia` (`documento`);

--
-- Filtros para la tabla `trabajos`
--
ALTER TABLE `trabajos`
  ADD CONSTRAINT `trabajos_ibfk_1` FOREIGN KEY (`documento_persona`) REFERENCES `persona` (`documento`),
  ADD CONSTRAINT `trabajos_ibfk_2` FOREIGN KEY (`id_experiencia`) REFERENCES `experiencia_laboral` (`id_experiencia`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SHOW TABLES;