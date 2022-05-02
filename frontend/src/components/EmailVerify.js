import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../src/ve.jpg"
import background from "../../src/error.webp"
import "./styles.css"
import { Box, Button, Img, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from '@chakra-ui/icons'


const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `/api/user/${param.id}/verify/${param.token}`;
				const { data } = await axios.get(url);
				console.log(data);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	return (
		<>
			{validUrl ? (
				<Box> 
					<Img
						src={success}
						alt="success_img"
						d="flex"
						justifyContent="center"
						fontFamily={'heading'}
						w="30%"
						h="45%"
						m="100px 0 15px 50%" />
					<Box
						d="flex"
						justifyContent="center"
						w="100%"
						m="10px 0 15px 15%"
					>
						<Text
							fontSize="2xl"
							fontFamily="fantasy"
							color="black"
						>
						 Email Verified Successfully
						</Text>
					</Box>
					<Link to="/">
						<Button
							variant="solid"
							colorScheme="orange"
							width="100%"
							d="flex"
							justifyContent="center"
							w="15%"
							m="10px 0 15px 57%"
							>
							Click here to login
						</Button>
					</Link>
				</Box>
			) : (
					<Box
						backgroundImage={background}
						min-height="90vh"
						d="flex"
						backgroundSize={'cover'}
						backgroundPosition="center"
						w="100%"

					>
						<Link to="/">
						<Button
							variant="solid"
							colorScheme="red"
							width="100%"
							d="flex"
							justifyContent="center"
							w="100%"
							m="10px 0 15px 57%"
							>
								<ArrowBackIcon m={3}/>
							Go Back to login page
						</Button>
					</Link>
				</Box>
			)}
		</>
	);
};

export default EmailVerify;