import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { client } from "@/lib/revolt";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HomePage() {
	return (
		<div className="w-full h-full flex-1 flex items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<h1>Hello {client.sessionToken?.username || "Not Logged In"}</h1>
				</CardHeader>
                <CardContent>
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="item-1"
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Item 1</AccordionTrigger>
                            <AccordionContent>
                                Content 1
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Item 2</AccordionTrigger>
                            <AccordionContent>
                                Content 2
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
			</Card>
		</div>
	);
}
