import React from "react";
import { Box, Typography } from "@material-ui/core";

const ProfileAvatarDescriptor = (props) => {
    return <Box component="div" ml={2} overflow="hidden">
        <Typography variant="h6">{props.userName}</Typography>
        <Typography variant="subtitle1">{props.descriptor}  {props.visitType}</Typography>
    </Box>
};

export default ProfileAvatarDescriptor;
