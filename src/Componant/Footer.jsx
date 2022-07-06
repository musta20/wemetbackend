
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Stack direction={'row'} spacing={6}>

     <Link className="text-muted" to={"/Terms"}>Terms of Service</Link>
       <Link className="text-muted" to={"/Privacy"}>Privacy Policy</Link>
          <Link className="text-muted" to={"/Guidelines"}>Community Guidelines</Link>
    
        </Stack>
        <Box><div className="Logo m-1" href="#"></div>

<small className="d-block mb-3 text-muted">© wemet.live 2017-2018</small></Box>
      </Container>
    </Box>
  );
}