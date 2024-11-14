import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BcList from './BcList';
import BcCreate from './BcCreate';
import Participant from './Participant';

const BCPAGE = () => {
    return (
        <Card className='rounded'>
            <CardHeader>
                <Tabs defaultValue="bc_list" className="w-full">
                    <TabsList>
                        <TabsTrigger value="bc_list">All BCs</TabsTrigger>
                        <TabsTrigger value="bc_create">Add New BC</TabsTrigger>
                        <TabsTrigger value="bc_participants">Participants</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bc_list">
                        <BcList />
                    </TabsContent>
                    <TabsContent value="bc_create">
                        <BcCreate />
                    </TabsContent>
                    <TabsContent value="bc_participants">
                        <Participant />
                    </TabsContent>
                </Tabs>
            </CardHeader>
            <CardContent>
                {/* <p>Additional card content can go here.</p> */}
            </CardContent>
            <CardFooter>
                {/* <p>Footer content for the card.</p> */}
            </CardFooter>
        </Card>
    );
};

export default BCPAGE;
