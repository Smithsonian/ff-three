/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import * as THREE from "three";

import RenderView from "./RenderView";
import RenderSystem from "./RenderSystem";
import { ECameraPreset, ECameraType } from "../UniversalCamera";

////////////////////////////////////////////////////////////////////////////////

export enum EQuadViewLayout { Single, HorizontalSplit, VerticalSplit, Quad }

export default class RenderQuadView extends RenderView
{
    protected _horizontalSplit = 0.5;
    protected _verticalSplit = 0.5;
    protected _layout: EQuadViewLayout = EQuadViewLayout.Quad;

    constructor(system: RenderSystem, canvas: HTMLCanvasElement,
        overlay: HTMLElement, params?: THREE.WebGLRendererParameters)
    {
        super(system, canvas, overlay, params);

        this.addViewport();
        this.addViewport(ECameraType.Orthographic, ECameraPreset.Top);
        this.addViewport(ECameraType.Orthographic, ECameraPreset.Left);
        this.addViewport(ECameraType.Orthographic, ECameraPreset.Front);

        this.layout = EQuadViewLayout.Single;
    }

    set layout(value: EQuadViewLayout) {
        if (this._layout !== value) {
            this._layout = value;
            this.updateConfiguration();
        }
    }

    get layout() {
        return this._layout;
    }

    set horizontalSplit(value: number) {
        this._horizontalSplit = value;
        this.updateSplitPositions();
    }

    get horizontalSplit() {
        return this._horizontalSplit;
    }

    set verticalSplit(value: number) {
        this._verticalSplit = value;
        this.updateSplitPositions();
    }

    get verticalSplit() {
        return this._verticalSplit;
    }

    protected updateConfiguration()
    {
        this.updateSplitPositions();
        this.viewports[0].enabled = true;

        switch (this._layout) {
            case EQuadViewLayout.Single:
                this.viewports[1].enabled = false;
                this.viewports[2].enabled = false;
                this.viewports[3].enabled = false;
                break;
            case EQuadViewLayout.HorizontalSplit:
            case EQuadViewLayout.VerticalSplit:
                this.viewports[1].enabled = true;
                this.viewports[2].enabled = false;
                this.viewports[3].enabled = false;
                break;
            case EQuadViewLayout.Quad:
                this.viewports[1].enabled = true;
                this.viewports[2].enabled = true;
                this.viewports[3].enabled = true;
                break;
        }
    }

    protected updateSplitPositions()
    {
        const h = this._horizontalSplit;
        const v = this._verticalSplit;

        switch (this._layout) {
            case EQuadViewLayout.Single:
                this.viewports[0].setSize(0, 0, 1, 1);
                break;
            case EQuadViewLayout.HorizontalSplit:
                this.viewports[0].setSize(0, 0, h, 1);
                this.viewports[1].setSize(h, 0, 1-h, 1);
                break;
            case EQuadViewLayout.VerticalSplit:
                this.viewports[0].setSize(0, 0, 1, v);
                this.viewports[1].setSize(0, v, 1, 1-v);
                break;
            case EQuadViewLayout.Quad:
                this.viewports[0].setSize(0, 0, h, v);
                this.viewports[1].setSize(h, 0, 1-h, v);
                this.viewports[2].setSize(0, v, h, 1-v);
                this.viewports[3].setSize(h, v, 1-h, 1-v);
                break;
        }
    }
}