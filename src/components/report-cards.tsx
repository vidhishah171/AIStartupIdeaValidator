"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ValidationReport } from "@/lib/types";
import { MarketDemandGauge } from "@/components/report-gauge";
import { cn } from "@/lib/utils";

type CardItem = {
  id: string;
  title: string;
  content: ReactNode;
};

function SortableCard({ id, title, content }: CardItem) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass-card rounded-3xl p-6 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)]",
        isDragging && "opacity-70 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.6)]"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button
          type="button"
          className="inline-flex cursor-grab items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground"
          {...attributes}
          {...listeners}
          aria-label="Drag card"
        >
          <GripVertical className="h-3.5 w-3.5" />
          Drag
        </button>
      </div>
      <div className="mt-4 text-base text-muted-foreground">{content}</div>
    </div>
  );
}

export function ReportCards({ report }: { report: ValidationReport }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const cardItems = useMemo<CardItem[]>(
    () => [
      {
        id: "summary",
        title: "Executive Summary",
        content: (
          <div className="grid gap-3 text-base text-muted-foreground">
            <p className="text-foreground/90">
              {report.ideaSummary || "Summary unavailable for this report."}
            </p>
            <div className="glass-muted rounded-2xl p-4 text-base">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Value Proposition
              </p>
              <p className="mt-2 text-foreground">
                {report.valueProposition || "Value proposition not provided."}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "market-demand",
        title: "Market Demand Score",
        content: (
          <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-center">
            <MarketDemandGauge value={report.marketDemandScore} />
            <p>{report.marketDemandJustification}</p>
          </div>
        ),
      },
      {
        id: "competitors",
        title: "Competitor Analysis",
        content: (
          <div className="grid gap-3 md:grid-cols-2">
            {report.competitors.map((competitor, index) => (
              <div
                key={`${competitor.name}-${index}`}
                className="glass-muted rounded-2xl p-4 text-base"
              >
                <p className="font-semibold text-foreground">
                  {competitor.name}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {competitor.description}
                </p>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "audience",
        title: "Target Audience persons",
        content: (
          <div className="grid gap-2 text-base">
            <p>
              <span className="font-semibold text-foreground">Role:</span>{" "}
              {report.targetAudience.role}
            </p>
            <p>
              <span className="font-semibold text-foreground">Age Range:</span>{" "}
              {report.targetAudience.ageRange}
            </p>
            <p>
              <span className="font-semibold text-foreground">Pain Point:</span>{" "}
              {report.targetAudience.painPoint}
            </p>
            <p>
              <span className="font-semibold text-foreground">Buying Power:</span>{" "}
              {report.targetAudience.buyingPower}
            </p>
          </div>
        ),
      },
      {
        id: "monetization",
        title: "Monetization Suggestions",
        content: (
          <div className="grid gap-3">
            {report.monetizationSuggestions.map((item, index) => (
              <div
                key={`${item.model}-${index}`}
                className="glass-muted rounded-2xl p-4 text-base"
              >
                <p className="font-semibold text-foreground">{item.model}</p>
                <p className="mt-2 text-muted-foreground">{item.fit}</p>
                <p className="mt-2 text-muted-foreground">{item.reason}</p>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "differentiation",
        title: "Positioning & Differentiation",
        content: (
          <div className="glass-muted rounded-2xl p-4 text-base text-muted-foreground">
            <p className="text-foreground/90">
              {report.differentiation || "Differentiation not provided."}
            </p>
          </div>
        ),
      },
      {
        id: "go-to-market",
        title: "Go-To-Market Plan",
        content: (
          <ul className="grid gap-2 text-base">
            {(report.goToMarketPlan && report.goToMarketPlan.length > 0
              ? report.goToMarketPlan
              : ["No go-to-market plan provided."]).map((step, index) => (
                <li key={`${step}-${index}`} className="rounded-2xl bg-muted/40 p-3">
                  {step}
                </li>
              ))}
          </ul>
        ),
      },
      {
        id: "strengths",
        title: "Strengths",
        content: (
          <ul className="grid gap-2">
            {report.strengths.map((strength, index) => (
              <li key={`${strength}-${index}`} className="rounded-2xl bg-muted/40 p-3 text-base">
                {strength}
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: "weaknesses",
        title: "Weaknesses",
        content: (
          <ul className="grid gap-2">
            {report.weaknesses.map((weakness, index) => (
              <li key={`${weakness}-${index}`} className="rounded-2xl bg-muted/40 p-3 text-base">
                {weakness}
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: "risks",
        title: "Risks & Open Questions",
        content: (
          <ul className="grid gap-2">
            {(report.risks && report.risks.length > 0
              ? report.risks
              : ["No key risks highlighted."]).map((risk, index) => (
                <li key={`${risk}-${index}`} className="rounded-2xl bg-muted/40 p-3 text-base">
                  {risk}
                </li>
              ))}
          </ul>
        ),
      },
      {
        id: "pivots",
        title: "Pivot Recommendations",
        content: (
          <ul className="grid gap-2">
            {report.pivotRecommendations.map((pivot, index) => (
              <li key={`${pivot}-${index}`} className="rounded-2xl bg-muted/40 p-3 text-base">
                {pivot}
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: "next-steps",
        title: "Next 30-Day Experiments",
        content: (
          <ul className="grid gap-2">
            {(report.nextSteps && report.nextSteps.length > 0
              ? report.nextSteps
              : ["No experiments outlined yet."]).map((step, index) => (
                <li key={`${step}-${index}`} className="rounded-2xl bg-muted/40 p-3 text-base">
                  {step}
                </li>
              ))}
          </ul>
        ),
      },
    ],
    [report]
  );

  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState(cardItems.map((card) => card.id));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItems(cardItems.map((card) => card.id));
  }, [cardItems]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const cardsById = useMemo(() => {
    const map = new Map(cardItems.map((card) => [card.id, card]));
    return map;
  }, [cardItems]);

  if (!mounted) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="grid gap-6">
          {items.map((id) => {
            const card = cardsById.get(id);
            if (!card) return null;
            return (
              <SortableCard
                key={card.id}
                id={card.id}
                title={card.title}
                content={card.content}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
