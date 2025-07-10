import React from "react";
import { SafeAreaView, View, Image, Text, } from "react-native";
export default (props) => {
	return (
		<SafeAreaView 
			style={{
				flex: 1,
				alignItems: "flex-start",
				backgroundColor: "#000000",
			}}>
			<View 
				style={{
					paddingBottom: 13,
					paddingLeft: 20,
					paddingRight: 33,
					marginVertical: 215,
					marginLeft: 233,
				}}>
				<Image
					source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JER5aM0GXd/z9pccgam_expires_30_days.png"}} 
					resizeMode = {"stretch"}
					style={{
						width: 136,
						height: 136,
					}}
				/>
				<Text 
					style={{
						position: "absolute",
						bottom: 0,
						left: 1,
						color: "#FFFFFF",
						fontSize: 36,
					}}>
					{"Expensely"}
				</Text>
			</View>
		</SafeAreaView>
	)
}
