import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  buttonText: string;
  features: string[];
  buttonDisabled?: boolean;
}

const PricingCard = (props: PricingCardProps) => {
  return (
    <Card className="w-full bg-slate-200">
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-6xl font-bold">${props.price}</h1>
          <span className="text-slate-600">/ month</span>
        </div>
        <ul className="text-xl">
          {props.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <Check size={22} />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex">
        <Button
          variant="primary"
          disabled={props.buttonDisabled}
          className="w-full transform border border-slate-600 transition duration-500 hover:scale-105 hover:border-0"
        >
          {props.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
