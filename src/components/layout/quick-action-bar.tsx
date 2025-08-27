import { Clock, FolderOpen, TrendingUp, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "../ui/card";

export default function QuickActionBar() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common document control tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Button variant="outline" className="h-20 flex-col">
                            <FolderOpen className="h-6 w-6 mb-2" />
                            <span className="text-xs">Browse Documents</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                            <Clock className="h-6 w-6 mb-2" />
                            <span className="text-xs">Review Queue</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                            <TrendingUp className="h-6 w-6 mb-2" />
                            <span className="text-xs">Audit Trail</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                            <Users className="h-6 w-6 mb-2" />
                            <span className="text-xs">User Management</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}