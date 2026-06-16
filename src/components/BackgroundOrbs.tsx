import FloatingOrb from './FloatingOrb';

interface BackgroundOrbsProps {
  variant?: 'hero' | 'default' | 'subtle';
}

export default function BackgroundOrbs({
  variant = 'default',
}: BackgroundOrbsProps) {
  if (variant === 'hero') {
    return (
      <>
        {/* Purple orb behind portrait */}
        <FloatingOrb
          size="min(350px, 70vw)"
          color="#B600A8"
          blur="100px"
          opacity={0.2}
          top="20%"
          left="50%"
          duration={8}
          delay={0}
        />
        {/* Blue orb top-right */}
        <FloatingOrb
          size="min(300px, 60vw)"
          color="#4A6CF7"
          blur="90px"
          opacity={0.15}
          top="10%"
          right="10%"
          duration={10}
          delay={2}
        />
        {/* Orange orb bottom-left */}
        <FloatingOrb
          size="min(280px, 55vw)"
          color="#BE4C00"
          blur="100px"
          opacity={0.12}
          bottom="30%"
          left="5%"
          duration={12}
          delay={4}
        />
      </>
    );
  }

  if (variant === 'subtle') {
    return (
      <>
        <FloatingOrb
          size="300px"
          color="#B600A8"
          blur="130px"
          opacity={0.08}
          top="30%"
          right="5%"
          duration={14}
          delay={1}
        />
        <FloatingOrb
          size="250px"
          color="#4A6CF7"
          blur="120px"
          opacity={0.06}
          bottom="20%"
          left="10%"
          duration={16}
          delay={3}
        />
      </>
    );
  }

  // default
  return (
    <>
      <FloatingOrb
        size="400px"
        color="#B600A8"
        blur="130px"
        opacity={0.12}
        top="15%"
        right="15%"
        duration={12}
        delay={0}
      />
      <FloatingOrb
        size="350px"
        color="#4A6CF7"
        blur="110px"
        opacity={0.1}
        bottom="25%"
        left="10%"
        duration={14}
        delay={3}
      />
      <FloatingOrb
        size="300px"
        color="#BE4C00"
        blur="120px"
        opacity={0.08}
        top="50%"
        right="30%"
        duration={16}
        delay={6}
      />
    </>
  );
}
