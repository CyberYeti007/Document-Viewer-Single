import { Card,
    CardHeader,
    CardTitle,
    CardContent,

 } from "./ui/card";

import { ReactNode } from "react";

interface CardTemplateProps {
    title: string;
    label: ReactNode;
    content: string | ReactNode;
    footer?: string
}

export function CardTemplate({ title, label, content, footer }: CardTemplateProps) {
    return (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{ title }</CardTitle>
            {label}
          </CardHeader>
          <CardContent>
            { content }
          </CardContent>
            {footer && (
                <div className="border-t pt-2 pl-4">
                <p className="text-xs text-muted-foreground">{footer}</p>
                </div>
            )}
        </Card>
    )
}