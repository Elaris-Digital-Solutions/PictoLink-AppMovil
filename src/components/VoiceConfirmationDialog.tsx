
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Check, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { convertTextToPictos } from "@/lib/api";
import { Pictogram } from "@/lib/pictograms";

interface VoiceConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (text: string) => void;
    transcript: string;
    isListening: boolean;
}

export function VoiceConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    transcript,
    isListening
}: VoiceConfirmationDialogProps) {
    const [previewPictograms, setPreviewPictograms] = useState<Pictogram[]>([]);
    const [loading, setLoading] = useState(false);

    // When transcript changes and is stable (e.g. paused), define logic?
    // For now, we only generate preview when the dialog is open and transcript has content

    useEffect(() => {
        if (isOpen && transcript.length > 2 && !isListening) {
            setLoading(true);
            const debounce = setTimeout(async () => {
                try {
                    const pictos = await convertTextToPictos(transcript);
                    setPreviewPictograms(pictos);
                } catch (e) {
                    console.error("Error previewing pictos:", e);
                } finally {
                    setLoading(false);
                }
            }, 500);
            return () => clearTimeout(debounce);
        } else if (!transcript) {
            setPreviewPictograms([]);
        }
    }, [isOpen, transcript, isListening]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mic className={isListening ? "animate-pulse text-red-500" : "text-gray-500"} />
                        {isListening ? "Escuchando..." : "Confirmar Mensaje"}
                    </DialogTitle>
                    <DialogDescription>
                        {isListening
                            ? "Habla ahora. Presiona 'Detener' cuando termines."
                            : "Verifica si esto es lo que quisiste decir."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* Transcript Text */}
                    <div className="p-4 bg-muted rounded-lg text-center text-lg font-medium min-h-[60px] flex items-center justify-center">
                        {transcript || "..."}
                    </div>

                    {/* Pictogram Preview */}
                    {!isListening && transcript && (
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider text-center">
                                Interpretación Visual
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center min-h-[80px] p-2 border rounded-md bg-slate-50">
                                {loading ? (
                                    <span className="text-sm text-gray-400 self-center">Generando pictogramas...</span>
                                ) : previewPictograms.length > 0 ? (
                                    previewPictograms.map((picto, idx) => (
                                        <div key={idx} className="flex flex-col items-center">
                                            <img src={picto.image_urls.png_color} alt={picto.labels.es} className="w-12 h-12 object-contain" />
                                            <span className="text-[10px] text-gray-500 max-w-[50px] truncate">{picto.labels.es}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-400 self-center">No se encontraron pictogramas claros</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between flex-wrap gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        <X className="h-4 w-4 mr-2" /> Cancelar
                    </Button>

                    {!isListening ? (
                        <div className="flex gap-2">
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => onConfirm(transcript)}>
                                <Check className="h-4 w-4 mr-2" /> Confirmar
                            </Button>
                        </div>
                    ) : (
                        <Button variant="destructive" onClick={onClose}>
                            Detener (Sin guardar)
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
