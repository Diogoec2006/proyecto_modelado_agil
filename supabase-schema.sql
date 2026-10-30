-- ====================================================================
-- SISTEMA DE REGISTRO DE NOTAS Y CURSOS - ESQUEMA SUPABASE (PostgreSQL)
-- Paleta y Tema del Proyecto: Azul y Plomo
-- ====================================================================

-- 1. Tabla: Cursos (courses)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    professor VARCHAR(255) NOT NULL,
    passing_grade NUMERIC(4, 2) NOT NULL DEFAULT 3.00,
    max_grade NUMERIC(4, 2) NOT NULL DEFAULT 5.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla: Estudiantes por Curso (students)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_course_student_code UNIQUE (course_id, code),
    CONSTRAINT uq_course_student_email UNIQUE (course_id, email)
);

-- 3. Tabla: Calificaciones / Notas (grades)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    activity VARCHAR(255) NOT NULL,
    score NUMERIC(4, 2) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Índices para optimizar búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_students_course_id ON public.students(course_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON public.grades(student_id);

-- 5. Habilitar Row Level Security (RLS) con políticas públicas
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acceso con anon key o service_role
DROP POLICY IF EXISTS "Permitir acceso completo a courses" ON public.courses;
CREATE POLICY "Permitir acceso completo a courses" ON public.courses
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso completo a students" ON public.students;
CREATE POLICY "Permitir acceso completo a students" ON public.students
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso completo a grades" ON public.grades;
CREATE POLICY "Permitir acceso completo a grades" ON public.grades
    FOR ALL USING (true) WITH CHECK (true);

-- 6. Trigger para actualizar automáticamente 'updated_at' en cursos
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_courses_updated_at ON public.courses;
CREATE TRIGGER trigger_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 7. Datos de prueba iniciales (Seeding)
INSERT INTO public.courses (id, code, name, description, professor, passing_grade, max_grade)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'PROG-101',
    'Modelado y Programación Ágil',
    'Curso práctico enfocado en arquitecturas limpias y desarrollo ágil',
    'Prof. Santiago Herrera',
    3.00,
    5.00
) ON CONFLICT (code) DO NOTHING;

INSERT INTO public.students (id, course_id, code, name, email)
VALUES 
(
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '20241001',
    'Mateo Restrepo',
    'mateo.restrepo@universidad.edu'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    '20241002',
    'Valentina Gómez',
    'valentina.gomez@universidad.edu'
) ON CONFLICT DO NOTHING;

INSERT INTO public.grades (id, student_id, activity, score, percentage, comments)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Primer Parcial Teórico',
    4.20,
    30.00,
    'Muy buen análisis de los patrones'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'Taller de Casos de Uso',
    4.80,
    20.00,
    'Excelente entrega a tiempo'
),
(
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000002',
    'Primer Parcial Teórico',
    3.50,
    30.00,
    'Revisar conceptos de herencia'
) ON CONFLICT DO NOTHING;

