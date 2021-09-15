import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as geo from 'd3-geo';
import * as d3 from 'd3';
import {geoConst} from '../geo.const';

@Component({
    selector: 'app-d3-province',
    templateUrl: './province.component.html',
    styleUrls: ['./province.component.scss']
})
export class ProvinceComponent implements OnInit, AfterViewInit {
    chinaJsonFile: string = geoConst.v2.china;
    provincePath: string = geoConst.v2.provincePath;
    provinceName = '北京市';
    provinceObj: {[key: string]: {name: string, center: number[]}} = {};

    constructor() {
    }

    ngOnInit(): void {
    }

    async ngAfterViewInit() {
        await this.getProvinceList();
        await this.init();
    }

    async getProvinceList() {

        const chinaData = await this.getJson(this.chinaJsonFile);
        for (const province of chinaData.features) {
            this.provinceObj[province.properties.name] = {
                name: province.properties.name,
                center: province.properties.center,
            };
        }
    }

    async init() {
        const data = await this.getJson(this.provincePath + this.provinceName + '.json');
        const svg = d3.select('#svg');
        const width = Number(svg.attr('width'));
        const height = Number(svg.attr('height'));
        const projection = geo.geoMercator()
            .scale(8050)
            .center(this.provinceObj[this.provinceName].center)
            .translate([width / 2, height / 2]);

        const path = geo.geoPath(projection);
        svg.attr('width', width)
            .attr('height', height);
        // const colors = d3.scaleOrdinal(d3Color.schemeBlues[5])
        const colors = d3.schemeCategory10;
        svg
            .selectAll('g')
            // ts-ignore
            .data(data.features)
            .enter()
            .append('g')
            .append('path')
            .attr('d', path)
            .attr('stroke', '#000000')
            .attr('stroke-linecap', 'round')
            .attr('fill-opacity', 0.5)
            .attr('stroke-width', 1)
            // @ts-ignore
            .attr('fill', (d, i) => {
                // return '#' + (Math.floor(Math.random() * 0xFFFFFF)).toString(16);
                // return colors(i / 40);

                // return 'transparent'
                return colors[i % 10];
                // return colors(i.toString());
            })
            .attr('fill-rule', 'evenodd')
            .attr('id', (d: any, i) => {
                return (d.properties || {}).name;
                // return d.priority.name;
            })
            .on('mouseover', function(d, i) {
                console.log(d3.select(this).attr('id'));
            });
    }

    async getJson(path) {
        // return await d3.json('/assets/data/qinghai.json');
        return await d3.json(path);
        // return await d3.json('/assets/data/qinghai-topo.json');
    }
}
