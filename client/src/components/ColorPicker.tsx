import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-white border rounded-xl shadow-sm">
      {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 justify-start h-10 px-3 bg-secondary/20 border-border/50 hover:bg-secondary/40 transition-colors"
          >
            <div 
              className="w-5 h-5 rounded-full border border-black/10 shadow-sm shrink-0" 
              style={{ backgroundColor: color }} 
            />
            <span className="font-mono text-xs uppercase">{color}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="mt-3 flex gap-2">
            {['#000000', '#ffffff', '#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea'].map((preset) => (
              <button
                key={preset}
                className="w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform"
                style={{ backgroundColor: preset }}
                onClick={() => onChange(preset)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
